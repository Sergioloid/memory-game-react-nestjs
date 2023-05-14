import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop({required : true, index: true, unique: true, type: String})
    username: string;

    @Prop({index: true})
    authToken: string;

    @Prop()
    lastCardArrayPlayed: string;

    @Prop()
    lastMatchStartedAt: number;

    @Prop()
    lastMatchFinishedAt: number;

    @Prop()
    lastMatchDuration: number;
    _id: string
}

export const UserSchema = SchemaFactory.createForClass(User);