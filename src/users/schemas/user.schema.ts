import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {

    _id: string;

    @Prop()
    nombre: string;

    @Prop()
    contrasena: string;

    @Prop()
    user: string;

    @Prop()
    correo: string;

    @Prop()
    rol?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);