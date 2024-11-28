import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/users.entity';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';
import { MoveModule } from './move/move.module';
import { InvitationsModule } from './invitations/invitations.module';
import { Invitation } from './invitations/entities/invitaions.entity';
import { Game } from './game/entities/game.entity';
import { Move } from './move/entities/move.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: `${process.env.POSTGRES_PASSWORD}`,
      entities: [User, Invitation, Game, Move],
      database: process.env.POSTGRES_DB,
      synchronize: true,
      autoLoadEntities: true,
      logging: true,
      ssl:
        process.env.NODE_ENV === 'production'
          ? {
              ca: process.env.SSL_CERT,
            }
          : false,
    }),
    EventEmitterModule.forRoot({
      // set this to `true` to use wildcards
      wildcard: false,
      // the delimiter used to segment namespaces
      delimiter: '.',
      // set this to `true` if you want to emit the newListener event
      newListener: false,
      // set this to `true` if you want to emit the removeListener event
      removeListener: false,
      // the maximum amount of listeners that can be assigned to an event
      maxListeners: 10,
      // show event name in memory leak message when more than maximum amount of listeners is assigned
      verboseMemoryLeak: false,
      // disable throwing uncaughtException if an error event is emitted and it has no listeners
      ignoreErrors: false,
    }),
    UsersModule,
    AuthModule,
    GameModule,
    MoveModule,
    InvitationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
