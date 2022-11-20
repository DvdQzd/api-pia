import { Body, Controller, Get, HttpException, Param, Post } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AttendanceService } from './attendance.service';
import { CreateClassDto } from './dto/create-class.dto';
import * as qrcode from 'qrcode';
import { User } from 'src/users/schemas/user.schema';
import { createTransport } from 'nodemailer';


@Controller('attendance')
export class AttendanceController {

    constructor(
        private readonly attendanceService: AttendanceService,
        private readonly userService: UsersService
    ) { }

    // create class 
    @Post('class')
    async createClass(@Body() body: CreateClassDto) {
        return await this.attendanceService.create(body);
    }

    // add alumno to class
    @Post('class/:classId/alumno')
    async addAlumnoToClass(
        @Body() alumnoData: User,
        @Param('classId') classId: string
    ) {

        if (!this.isValidObjectId(classId)) {
            throw new HttpException('Invalid classId', 400);
        }

        // check if class exists
        const classData = await this.attendanceService.findById(classId);

        if (!classData) {
            throw new HttpException('Class not found', 404);
        }

        // check if alumno exists
        const alumno = await this.userService.findUserByCorreo(alumnoData.correo);
        if (!alumno) {
            throw new HttpException('Alumno not found', 404);
        }

        // check if alumno is already in class
        const alumnoExistsInClass = classData.alumnos.find(
            alumnoData => alumnoData.correo === alumno.correo
        );

        if (alumnoExistsInClass) {
            throw new HttpException('Alumno already exists in class', 400);
        }

        // add alumno to class
        await this.attendanceService.addAlumnoToClass(classId, alumno);

        // send email to profesor
        this.sendAlumnoEmail(alumno, classData);

        return {
            message: 'Alumno added to class'
        }
    }

    private async sendAlumnoEmail(alumno: User, classData: any) {
        const transporter = createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
         });
         
        const mailOptions = {
            from: `Confirmacion de asistencia - ${alumno.correo}`,
            to: `${classData.profesor.correo}, ${alumno.correo}`,
            subject: `Confirmacion de asistencia ${classData.ramo} - ${alumno.nombre}, ${alumno.correo}`,
            html: `<p>Se ha registrado asistencia a la clase ${classData.ramo}.</p>
            <p>Profesor: ${classData.profesor.nombre} - ${classData.profesor.correo}</p>
            <p>Alumno: ${alumno.nombre}</p>`
        }
        try {
            const info = await transporter.sendMail(mailOptions)
            console.log(info)
        } catch (error) {
            console.log(error)
        }
    }

    private isValidObjectId(id: string): boolean {
        return id.match(/^[0-9a-fA-F]{24}$/) !== null;
    }

    @Get('class/:classId/qrcode')
    async getQRCode(@Param('classId') classId: string) {

        // check if class exists
        const classData = await this.attendanceService.findById(classId);

        if (!classData) {
            throw new HttpException('Class not found', 404);
        }

        // return qrcode
        return {
            image: await qrcode.toDataURL(classId)
        }
    }

    // get classes by profesor
    @Get('profesor/:profesorId/classes')
    async getClassesByProfesor(@Param('profesorId') profesorId: string) {
        return await this.attendanceService.findClassByProfesorId(profesorId);
    }

}
