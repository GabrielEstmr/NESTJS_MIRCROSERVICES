

Resiliência Arquitetura:

API GATEWAY executando e microservicoes parados:
Se: GET: => da erro
POST => fica na fila do Broker(olha aba Queue) (inclusive recebe Status code 201 <Criado com sucesso>)
    -Quando sobe o servico de novo a fila do Borker já dispara a requisição
BANCO MICROSERVICO FORA DO AR: aplicação fala que deu POST mas a msg de erro fica no escopo (console) apenas do microservico
    -Tem que aplicar tratamento de erros


implementação GUIA => encaminha de forma async pro broker(RabbitMQ) e joga pra fila (e apenas retorna msg sucesso)


API GATEWAY => async event emitter => <Broker> => <Servico> => event subscriber => <MONGO>


persistencia de arquivos no S# (baixo custo e alta disponibilidade)
    => referencia (url) é persistida no Mongo (refencia pro arquivo)


    variaveis de ambiente => config nestjs