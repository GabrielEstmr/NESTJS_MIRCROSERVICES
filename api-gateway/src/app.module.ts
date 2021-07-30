import { Module } from '@nestjs/common';
import { CategoriasModule } from './categorias/categorias.module';
import { JogadoresModule } from './jogadores/jogadores.module';
import { ClientProxySmartRanking } from './proxyrmq/client-proxy'
import { ProxyRMQModule } from './proxyrmq/proxyrmq.module';
import { AwsModule } from './aws/aws.module';
import { ConfigModule } from '@nestjs/config';//importando de forma global pra nao ter que importar em todo modulo

@Module({
  imports: [CategoriasModule, JogadoresModule, ProxyRMQModule, AwsModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [],
  providers: [ClientProxySmartRanking],
})
export class AppModule { }
