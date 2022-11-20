import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { User } from "src/users/entities/user.entity";

export type ClassDocument = HydratedDocument<Class>;

@Schema()
export class Class {

    _id: string;

    @Prop()
    ramo: string;

    @Prop()
    descripcion: string;

    @Prop()
    fechaInicio: Date;

    @Prop()
    profesor: User;

    @Prop()
    alumnos: User[];
}

export const ClassSchema = SchemaFactory.createForClass(Class);
