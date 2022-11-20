import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { CreateClassDto } from './dto/create-class.dto';
import { Class, ClassDocument } from './schemas/class.schema';

@Injectable()
export class AttendanceService {

    constructor(@InjectModel(Class.name) private classModel: Model<ClassDocument>) { }

    async create(createClassDto: CreateClassDto): Promise<Class> {
        const createdClass = new this.classModel(createClassDto);
        return await createdClass.save();
    }

    async findAll(): Promise<Class[]> {
        return await this.classModel.find().exec();
    }

    async findById(id: string): Promise<Class> {
        return await this.classModel.findById({ _id: id }).exec();
    }

    async findClassByProfesorId(profesorId: string): Promise<Class[]> {
        return await this.classModel.find({ 'profesor._id': profesorId }).exec();
    }

    async addAlumnoToClass(classId: string, alumno: User): Promise<Class> {
        return await this.classModel.findOneAndUpdate(
            {
                _id: classId
            },
            {
                $push: { alumnos: alumno }
            })
            .exec();
    }
}
