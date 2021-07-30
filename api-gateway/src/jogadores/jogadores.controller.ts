import { Controller, Get, Logger, Post, UsePipes, ValidationPipe, Body, Query, Put, Param, BadRequestException, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto'
import { Observable } from 'rxjs';
import { ClientProxySmartRanking } from '../proxyrmq/client-proxy'
import { ValidacaoParametrosPipe } from '../common/pipes/validacao-parametros.pipe'
import { FileInterceptor } from '@nestjs/platform-express';
// import { fileURLToPath } from 'url';
import { AwsService } from '../aws/aws.service'

@Controller('api/v1/jogadores')
export class JogadoresController {

  private logger = new Logger(JogadoresController.name);

  private clientAdminBackend = this.clientProxySmartRanking.getClientProxyAdminBackendInstance()

  constructor(
    private clientProxySmartRanking: ClientProxySmartRanking,
    private awsService: AwsService
  ) { }



  @Post()
  @UsePipes(ValidationPipe)
  async criarJogador(

    @Body()
    criarJogadorDto: CriarJogadorDto

  ) {
    this.logger.log(`criarJogadorDto: ${JSON.stringify(criarJogadorDto)}`)
    //Enviando requisição para ver se há categoria
    const categoria = await this.clientAdminBackend.send('consultar-categorias', criarJogadorDto.categoria).toPromise()
    if (categoria) {
      await this.clientAdminBackend.emit('criar-jogador', criarJogadorDto)
    } else {
      throw new BadRequestException(`Categoria não cadastrada!`)
    }
  }


  @Get()
  consultarJogadores(

    @Query('idJogador')
    _id: string

  ): Observable<any> {
    return this.clientAdminBackend.send('consultar-jogadores', _id ? _id : '')
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async atualizarJogador(

    @Body()
    atualizarJogadorDto: AtualizarJogadorDto,

    @Param('_id', ValidacaoParametrosPipe)
    _id: string

  ) {

    const categoria = await this.clientAdminBackend.send('consultar-categorias', atualizarJogadorDto.categoria).toPromise()
    if (categoria) {
      await this.clientAdminBackend.emit('atualizar-jogador', { id: _id, jogador: atualizarJogadorDto })
    } else {
      throw new BadRequestException(`Categoria não cadastrada!`)
    }
  }

  @Delete('/:_id')
  async deletarJogador(

    @Param('_id', ValidacaoParametrosPipe)
    _id: string

  ) {
    await this.clientAdminBackend.emit('deletar-jogador', { _id })
  }


  //Upload File Jogadores
  @Post('/:_id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadArquivos(

    @UploadedFile()
    file,

    @Param('_id')
    _id: string

  ) {

    console.log(file);

    //=>Verificar se há jogador
    const jogador = await this.clientAdminBackend.send('consultar-jogadores', _id).toPromise();
    if (!jogador) {
      throw new BadRequestException(`Jogador não encontrado!`);
    }

    //=>Enviar arquivo S3 e recuperar URL
    const urlFotoJogador = await this.awsService.uploadArquivo(file, _id);
    // return urlFotoJogador;

    //=>Atualizar campo URL tabela jogador
    const atualizarJogadorDto: AtualizarJogadorDto = {};
    atualizarJogadorDto.urlFotoJogador = urlFotoJogador.url;

    //EMIT = ASYNC!!!!
    await this.clientAdminBackend.emit('atualizar-jogador',
      {
        id: _id, jogador: atualizarJogadorDto
      });

    //=>Retornar jogador atualizado
    return this.clientAdminBackend.send('consultar-jogadores', _id);


  }


}