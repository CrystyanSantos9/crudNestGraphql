import { Injectable, Logger } from '@nestjs/common';
import { Connection, createPool, Pool } from 'mysql2/promise';

@Injectable()
export class MySQLProvider {
  private readonly logger: Logger;
  private readonly pool: Pool;
  constructor() {
    this.logger = new Logger('MysqlProvider');
    //iniciando o nosso pool de conexões
    this.pool = createPool({
      host: process.env.DB_HOST ? process.env.DB_HOST : '192.168.1.103',
      user: process.env.DB_USER ? process.env.DB_USER : 'root',
      password: process.env.DB_PASSWORD ? process.env.DB_PASSWORD : 'senha',
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3336,
      database: process.env.DB_DATABASE ? process.env.DB_DATABASE : 'cat-products',
      waitForConnections: true,
      connectionLimit: 20,
      queueLimit: 0,
    });
    this.logger.log('Initialized!');
  }
  async getConnection(): Promise<Connection> {
    return await this.pool.getConnection();
  }
}
