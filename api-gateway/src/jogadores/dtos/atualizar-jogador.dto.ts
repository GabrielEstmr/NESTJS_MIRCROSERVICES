import { IsNotEmpty, IsOptional } from 'class-validator'

export class AtualizarJogadorDto {

    //readonly => nao quer alterar

    // @IsNotEmpty()
    // readonly telefoneCelular: string;

    // @IsNotEmpty()
    // readonly nome: string;



    @IsOptional()
    categoria?: string;

    @IsOptional()
    urlFotoJogador?: string;
}