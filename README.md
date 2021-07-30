SETUP DA APLICAÇÃO

## Descrição

  O projeto foi dividido em 2 serviços: um é o API Gateway, resposável por redirecionar as requisições,
e o outro é o microserviço de Pokemons, responsável por persistir as informações no banco de dados.

## Instalação

  Inicialmente instale as bibliotecas do projeto rodando 

  ```bash
 $ yarn
  ```
  na raiz de cada projeto.

  O projeto usa o RabbitMQ como serviço de mensageria para realizar a comunicação entre os microsserviços.
  Usa como bases de dados o MongoDB e o Postgres, ambos conteinerizados no Docker através do Docker Compose.

  Para criar os serviços rode:

  ```bash
$ docker-compose up
  ```
  na raiz do projeto david-api-gateway.

  Para criar o banco Postgres, rode: 

  ```bash
$ yarn db:create
  ```
  na raiz do projeto david-ms-pokemon


## Executar

Para subir os microsserviços

```bash
$ yarn start:dev
```
na raiz de cada projeto.

## Repositório

`API GATEWAY`: https://github.com/daviddantasjunior/david-api-gateway

`POKEMON MICROSERVICE`: https://github.com/daviddantasjunior/david-ms-pokemon

## Criado por

- Author - [David Dantas da Silva Júnior](https://github.com/daviddantasjunior)