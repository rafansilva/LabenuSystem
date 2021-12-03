import Module from "module";
import { date_fmt } from "../config/helpers";
import connection from "../core/connection";

//Types
import { Turma } from "./types/turma";

// get all classes
export const getAllClass = async (): Promise<Turma[] | boolean> => {
    try {
        const result = await connection("class");

        const resultModified = result.map((turma: Turma) => {
            return {
                id: turma.id,
                name: turma.name,
                period: turma.period,
                module: turma.module,
                initialDate: date_fmt(turma.initial_date),
                finalDate: date_fmt(turma.final_date)
            };
        });

        return resultModified;
    } catch (error) {
        console.log(error);
        return false;
    }
};

//get class by id
export const getClassById = async (id: number, moreInfo: boolean = false): Promise<any> => {
    try {
        let result;
        if (moreInfo) {
            let turma = await connection("class").select("*").where({ id: id });
            let students = await connection("student").select("*").where({ class_id: id });
            let teachers = await connection("teacher").select("*").where({ class_id: id });

            const resultModified = turma.map((turma: any) => {
                return {
                    id: turma.id,
                    name: turma.name,
                    period: turma.period,
                    module: turma.module,
                    initialDate: date_fmt(turma.initial_date),
                    finalDate: date_fmt(turma.final_date),
                    teachers: teachers.map((t: any) => {
                        return {
                            id: t.id,
                            name: t.name,
                            email: t.email,
                            birthDate: date_fmt(t.birth_date)
                        };
                    }),
                    students: students.map((s: any) => {
                        return {
                            id: s.id,
                            name: s.name,
                            email: s.email,
                            birthDate: date_fmt(s.birth_date)
                        };
                    })
                };
            });

            return resultModified;
        } else {
            result = await connection.select("*").from("class").where({ id: id });

            if (result.length > 0) {
                return result[0];
            } else {
                return false;
            }
        }
    } catch (error) {
        console.log(error);
        return false;
    }
};

// Add teacher in class
export const addTeacherInClass = async (userId: number, classId: number): Promise<boolean> => {
    try {
        await connection("teacher").update({ class_id: classId }).where({ id: userId });

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

// Create a new class
export const createTurma = async (turma: Turma): Promise<boolean> => {
    try {
        await connection("class").insert(turma);

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

// Update Module Turma
export const updateModule = async (turmaId: number, module: number): Promise<boolean> => {
    try {
        await connection("class")
            .update({
                module: module
            })
            .where({ id: turmaId });

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};
