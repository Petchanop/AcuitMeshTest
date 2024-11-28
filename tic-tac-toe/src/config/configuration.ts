import { Game } from 'src/game/entities/game.entity';
import { User } from '../users/entities/users.entity';
import { DataSource } from 'typeorm';
import { Move } from 'src/move/entities/move.entity';
import { Invitation } from 'src/invitations/entities/invitaions.entity';

export default () => ({
  port: parseInt(process.env.PORT) || 3000,
  database: {
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
  },
});

//db configuration
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: `${process.env.POSTGRES_PASSWORD}`,
  entities: [User, Game, Move, Invitation],
  database: process.env.POSTGRES_DB,
  synchronize: true,
  logging: true,
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
