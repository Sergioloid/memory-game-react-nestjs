import {MiddlewareConsumer, Module} from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {MongooseModule} from '@nestjs/mongoose';
import {GameController} from "./Controllers/GameController";
import {UserController} from "./Controllers/UserController";
import {GameService} from "./Services/GameService";
import {UserService} from "./Services/UserService";
import {ScoreService} from "./Services/ScoreService";
import {TokenMiddleware} from "./Middlewares/TokenMiddleware";
import {User, UserSchema} from "./Schemas/UserSchema";

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://root:example@mongodb:27017', {
            autoIndex: true,
            dbName: "aryel"
        }),
        MongooseModule.forFeatureAsync([
            {
                name: User.name,
                useFactory: () => {
                    const schema = UserSchema;
                    schema.plugin(require('mongoose-unique-validator'), { message: 'Username should be unique' }); // or you can integrate it without the options   schema.plugin(require('mongoose-unique-validator')
                    return schema;
                },
            },
        ]),
        ConfigModule.forRoot()
    ],
    controllers: [GameController, UserController],
    providers: [GameService, UserService, ScoreService, User],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(TokenMiddleware)
            .forRoutes(GameController);
    }
}
