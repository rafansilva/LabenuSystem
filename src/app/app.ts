import { Request, Response } from "express";

//types
import { Turma } from "../models/types/turma";
import { User } from "../models/types/user";
import { Teacher } from "../models/types/teacher";
import { Hobby } from "../models/types/hobby";

//Helpers
import { create_uuid, date_fmt_back, isEmpty } from "../config/helpers";

//Connections database
import { addTeacherInClass, createTurma, getAllClass, getClassById, updateModule } from "../models/Turma";
import {
    addInClass,
    createHobby,
    createStudentHobbies,
    createUser,
    findHobbies,
    getAgeStudent,
    getStudentsByClass,
    getStudentsByHobby,
    removeClass,
    removeStudent
} from "../models/User";
import {
    createTeacher,
    createTeacherSpecialty,
    findSpecially,
    getTeacherByClass,
    removeTheClass
} from "../models/Teacher";

/**
 * ####################
 * ###   Students   ###
 * ####################
 */

//Endpoint: Exibir estudantes de uma turma.
export const showStudentsByClass = async (req: Request, res: Response): Promise<void> => {
    try {
        const turmaId = Number(req.params.id);

        if (!turmaId) {
            res.statusCode = 406;
            throw new Error("Não foi possível identificar turma.");
        }

        if (isNaN(turmaId)) {
            res.statusCode = 406;
            throw new Error("Não foi possível identificar turma.");
        }

        const result = await getStudentsByClass(turmaId);

        if (result === false) {
            res.statusCode = 404;
            throw new Error("Turma não encontrada.");
        } else {
            res.status(200).send(result);
        }
    } catch (e) {
        const error = e as Error;
        console.log(error);
        res.send({ message: error.message });
    }
};

// Endpoint: Exibir estudantes que possuam o mesmo hobby;
export const showStudentsByHobby = async (req: Request, res: Response): Promise<void> => {
    try {
        const hobbyName = req.query.hobbyName as string;

        if (!hobbyName) {
            res.statusCode = 406;
            throw new Error("Campo inválido");
        }

        const result = await getStudentsByHobby(hobbyName);

        if (result === false) {
            res.statusCode = 404;
            throw new Error("Estudantes não encontrados.");
        } else {
            res.status(200).send(result);
        }
    } catch (e) {
        const error = e as Error;
        console.log(error);
        res.send({ message: error.message });
    }
};

// Endpoint: Exibir estudantes que possuam o mesmo hobby;
export const showStudentsAge = async (req: Request, res: Response): Promise<void> => {
    try {
        const studentId = Number(req.params.id);

        if (!studentId) {
            res.statusCode = 406;
            throw new Error("Campo inválido");
        }

        if (isNaN(studentId)) {
            res.statusCode = 406;
            throw new Error("Não foi possível identificar estudante.");
        }

        const result = await getAgeStudent(studentId);

        if (result === false) {
            res.statusCode = 404;
            throw new Error("Estudante não encontrado.");
        } else {
            res.status(200).send(result);
        }
    } catch (e) {
        const error = e as Error;
        console.log(error);
        res.send({ message: error.message });
    }
};

// Endpoint: Criar Estudante
export const createUserApp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, birthDate, hobbies } = req.body;

        if (isEmpty(hobbies) || hobbies[0] === "") {
            res.statusCode = 406;
            throw new Error("Hobbies Inválidos! Informe no mínimo 1 hobby do estudante.");
        }

        if (!name || !email || !birthDate) {
            res.statusCode = 406;
            throw new Error("Campos inválidos.");
        }

        const id: number = create_uuid();

        const newUser: User = {
            id: id,
            name: name,
            email: email,
            birth_date: date_fmt_back(birthDate)
        };

        let existingHobbies = await findHobbies(hobbies);

        for (let i = 0; i < hobbies.length; i++) {
            const contains = existingHobbies.some((j: any) => {
                return j.name === hobbies[i];
            });

            if (contains === false) {
                const newHobbyId = create_uuid();
                const newHobby: Hobby = {
                    id: newHobbyId,
                    name: hobbies[i]
                };

                const create = await createHobby(newHobby);

                if (create === false) {
                    res.statusCode = 400;
                    throw new Error("Não foi possível criar hobbies. Tente novamente mais tarde.");
                }
            }
        }

        existingHobbies = await findHobbies(hobbies);

        const result = await createUser(newUser);

        if (result === false) {
            res.statusCode = 400;
            throw new Error("Oops! Não foi possível criar um novo estudante! Tente novamente mais tarde");
        } else {
            for (let i: number = 0; i < hobbies.length; i++) {
                const studentHobbies = await createStudentHobbies(newUser.id, existingHobbies[i].id);

                if (studentHobbies === false) {
                    res.statusCode = 400;
                    throw new Error("Não foi possível registrar os hobbies do estudante. Tente novamente mais tarde.");
                }
            }

            res.status(201).send({ message: `Estudante criado com sucesso!` });
        }
    } catch (e) {
        const error = e as Error;
        console.log(error);
        res.send({ message: error.message });
    }
};

//Endpoint: Adicionar estudante na turma;
export const addStudentInClassApp = async (req: Request, res: Response): Promise<void> => {
    try {
        const studentId = Number(req.query.studentId);
        const classId = Number(req.query.classId);

        if (!studentId || !classId) {
            res.statusCode = 406;
            throw new Error("Campos inválidos.");
        }

        if (isNaN(classId) || isNaN(studentId)) {
            res.statusCode = 406;
            throw new Error("Campo 'studentId' ou 'classId' inválidos.");
        }

        const turma = await getClassById(classId, false);

        if (turma === false) {
            res.statusCode = 404;
            throw new Error("Turma não encontrada.");
        }

        const result = await addInClass(studentId, classId);

        if (result === false) {
            res.statusCode = 404;
            throw new Error(`Não foi possível adicionar estudante na turma ${turma.name}. Tente novamente mais tarde.`);
        } else {
            res.status(200).send({ message: `Estudante adicionado na turma ${turma.name} com sucesso!` });
        }
    } catch (e) {
        const error = e as Error;
        console.log(error);
        res.send({ message: error.message });
    }
};

// Endpoint: Remover estudante de uma turma;
export const removeStudentTheClass = async (req: Request, res: Response): Promise<void> => {
    try {
        const studentId = Number(req.query.studentId);
        const classId = Number(req.query.classId);

        if (!studentId || !classId) {
            res.statusCode = 406;
            throw new Error("Campos inválidos.");
        }

        if (isNaN(classId) || isNaN(studentId)) {
            res.statusCode = 406;
            throw new Error("Campo 'studentId' ou 'classId' inválidos.");
        }

        const turma = await getClassById(classId, false);

        if (turma === false) {
            res.statusCode = 404;
            throw new Error("Turma não encontrada.");
        }

        const result = await removeClass(studentId);

        if (result === false) {
            res.statusCode = 404;
            throw new Error(`Não foi possível remover estudante da turma ${turma.name}. Tente novamente mais tarde.`);
        } else {
            res.status(200).send({ message: `Estudante removido da turma ${turma.name} com sucesso!` });
        }
    } catch (e) {
        const error = e as Error;
        console.log(error);
        res.send({ message: error.message });
    }
};

// Endpoint: Remover estudante
export const removeStudentApp = async (req: Request, res: Response): Promise<void> => {
    try {
        const studentId = Number(req.params.id);

        if (!studentId) {
            res.statusCode = 406;
            throw new Error("Campos inválidos.");
        }

        if (isNaN(studentId)) {
            res.statusCode = 406;
            throw new Error("Campo 'studentId' ou 'classId' inválidos.");
        }

        const result = await removeStudent(studentId);

        if (result === false) {
            res.statusCode = 404;
            throw new Error(`Não foi possível remover estudante. Tente novamente mais tarde.`);
        } else {
            res.status(200).send({ message: `Estudante removido com sucesso!` });
        }
    } catch (e) {
        const error = e as Error;
        console.log(error);
        res.send({ message: error.message });
    }
};

/**
 * ###################
 * ###   Teacher   ###
 * ###################
 */

//Endpoint: Exibir docentes de uma turma;
export const showTeachersByClass = async (req: Request, res: Response): Promise<void> => {
    try {
        const turmaId = Number(req.params.id);

        if (!turmaId) {
            res.statusCode = 406;
            throw new Error("Não foi possível identificar turma.");
        }

        if (isNaN(turmaId)) {
            res.statusCode = 406;
            throw new Error("Não foi possível identificar turma.");
        }

        const result = await getTeacherByClass(turmaId);

        if (result === false) {
            res.statusCode = 404;
            throw new Error("Turma não encontrada.");
        } else {
            res.status(200).send(result);
        }
    } catch (e) {
        const error = e as Error;
        console.log(error);
        res.send({ message: error.message });
    }
};

//Endpoint: Criar docente
export const createTeacherApp = async (req: Request, res: Response): Promise<void> => {
    try {
        let { name, email, birthDate, specialtyName } = req.body;

        if (isEmpty(specialtyName)) {
            res.statusCode = 406;
            throw new Error("Informe no mínimo 1 especialidade do docente.");
        }

        if (!name || !email || !birthDate) {
            res.statusCode = 406;
            throw new Error("Campos inválidos.");
        }

        const specialty = await findSpecially(specialtyName);

        if (typeof specialty === "string") {
            res.statusCode = 404;
            throw new Error(`Não foi possivel encontrar especialidade '${specialty}'. Verifique novamente.`);
        }

        const id: number = create_uuid();

        const newTeacher: Teacher = {
            id: id,
            name: name,
            email: email,
            birth_date: date_fmt_back(birthDate)
        };

        const result = await createTeacher(newTeacher);

        if (result === false) {
            res.statusCode = 400;
            throw new Error("Oops! Não foi possível criar um novo docente! Tente novamente mais tarde");
        } else {
            for (let i: number = 0; i < specialtyName.length; i++) {
                const createSpeacialty = await createTeacherSpecialty(newTeacher.id, specialty[i].id);

                if (createSpeacialty === false) {
                    res.statusCode = 400;
                    throw new Error("Não foi possível registrar especialidade do docente. Tente novamente mais tarde.");
                }
            }

            res.status(201).send({ message: `Docente criado com sucesso!` });
        }
    } catch (e) {
        const error = e as Error;
        console.log(error);
        res.send({ message: error.message });
    }
};

// Endpoint: Adicionar docente na turma;
export const addTeacherInClassApp = async (req: Request, res: Response): Promise<void> => {
    try {
        const teacherId = Number(req.query.teacherId);
        const classId = Number(req.query.classId);

        if (!teacherId || !classId) {
            res.statusCode = 406;
            throw new Error("Campos inválidos.");
        }

        if (isNaN(classId) || isNaN(teacherId)) {
            res.statusCode = 406;
            throw new Error("Campo 'teacherId' ou 'classId' inválidos.");
        }

        const turma = await getClassById(classId, false);

        if (turma === false) {
            res.statusCode = 404;
            throw new Error("Turma não encontrada.");
        }

        const result = await addTeacherInClass(teacherId, classId);

        if (result === false) {
            res.statusCode = 404;
            throw new Error(`Não foi possível adicionar docente na turma ${turma.name}. Tente novamente mais tarde.`);
        } else {
            res.status(200).send({ message: `Docente adicionado na turma ${turma.name} com sucesso!` });
        }
    } catch (e) {
        const error = e as Error;
        console.log(error);
        res.send({ message: error.message });
    }
};

//Endpoint: Remover docente de uma turma
export const removeTeacherTheClass = async (req: Request, res: Response): Promise<void> => {
    try {
        const teacherId = Number(req.query.teacherId);
        const classId = Number(req.query.classId);

        if (!teacherId || !classId) {
            res.statusCode = 406;
            throw new Error("Campos inválidos.");
        }

        if (isNaN(classId) || isNaN(teacherId)) {
            res.statusCode = 406;
            throw new Error("Campo 'teacherId' ou 'classId' inválidos.");
        }

        const turma = await getClassById(classId, false);

        if (turma === false) {
            res.statusCode = 404;
            throw new Error("Turma não encontrada.");
        }

        const result = await removeTheClass(teacherId);

        if (result === false) {
            res.statusCode = 404;
            throw new Error(`Não foi possível remover docente da turma ${turma.name}. Tente novamente mais tarde.`);
        } else {
            res.status(200).send({ message: `Docente removido da turma ${turma.name} com sucesso!` });
        }
    } catch (e) {
        const error = e as Error;
        console.log(error);
        res.send({ message: error.message });
    }
};

/**
 * #################
 * ###   Class   ###
 * #################
 */

//Endpoint: pegar todas as turmas
export const getAllClassApp = async (req: Request, res: Response): Promise<void> => {
    try {
        const allClasses = await getAllClass();

        if (allClasses === false) {
            res.statusCode = 404;
            throw new Error("Nenhuma turma encontrada!");
        } else {
            res.status(200).send(allClasses);
        }
    } catch (e) {
        const error = e as Error;
        console.log(error);
        res.send({ message: error.message });
    }
};

//Endpoint: Pegar turma pelo id e listar professores e alunos dessa turma
export const getClassByIdApp = async (req: Request, res: Response): Promise<void> => {
    try {
        const turmaId = Number(req.params.id);

        if (!turmaId) {
            res.statusCode = 406;
            throw new Error("Não foi possível identificar turma.");
        }

        if (isNaN(turmaId)) {
            res.statusCode = 406;
            throw new Error("Não foi possível identificar turma.");
        }

        const turma = await getClassById(turmaId, true);

        if (turma === false) {
            res.statusCode = 404;
            throw new Error("Nenhuma turma encontrada!");
        } else {
            res.status(200).send(turma);
        }
    } catch (e) {
        const error = e as Error;
        console.log(error);
        res.send({ message: error.message });
    }
};

// Endpoint: Criar Turma
export const createTurmaApp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, period, module, initialDate, finalDate } = req.body;

        if (isNaN(module)) {
            res.statusCode = 406;
            throw new Error("Campo 'module' inválido.");
        }

        if (module < 1 || module > 7) {
            res.statusCode = 406;
            throw new Error("O módulo só pode assumir valores de 1 a 7!");
        }

        if (!name || !period || !initialDate || !finalDate) {
            res.statusCode = 406;
            throw new Error("Campos inválidos.");
        }

        if (period !== "integral" && period !== "noturna") {
            res.statusCode = 406;
            throw new Error("Período Inválido! Somente turmas 'integral' ou 'noturna' podem ser criadas.");
        }

        const id: number = create_uuid();

        const newTurma: Turma = {
            id: id,
            name: name,
            period: period,
            module: module,
            initial_date: date_fmt_back(initialDate),
            final_date: date_fmt_back(finalDate)
        };

        const result = await createTurma(newTurma);

        if (result === false) {
            res.statusCode = 400;
            throw new Error("Oops! Não foi possível criar uma nova turma! Tente novamente mais tarde");
        } else {
            res.status(201).send({ message: `A turma ${name} foi criada com sucesso!` });
        }
    } catch (e) {
        const error = e as Error;
        console.log(error);
        res.send({ message: error.message });
    }
};

// Endpoint: Mudar modulo da turma
export const changeModuleClass = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.query.id);
        const module = Number(req.query.module);

        if (!id || !module) {
            res.statusCode = 406;
            throw new Error("Campos inválidos.");
        }

        if (isNaN(module) || isNaN(id)) {
            res.statusCode = 406;
            throw new Error("Campo 'id' ou 'module' inválidos.");
        }

        const checkClass = await getClassById(id, false);

        if (checkClass === false) {
            res.statusCode = 404;
            throw new Error("Turma não encontrada.");
        }

        const result = await updateModule(id, module);

        if (result === false) {
            res.statusCode = 400;
            throw new Error("Oops! Não foi possível o modulo dessa turma! Tente novamente mais tarde");
        } else {
            res.status(201).send({ message: `Módulo atualizado com sucesso!` });
        }
    } catch (e) {
        const error = e as Error;
        console.log(error);
        res.send({ message: error.message });
    }
};
