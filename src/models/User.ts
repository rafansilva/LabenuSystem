import connection from "../core/connection";

//Types
import { User } from "./types/user";
import { Hobby } from "./types/hobby";

//Helpers
import { ageFromDateOfBirthday, date_fmt } from "../config/helpers";

// Get students by id return age student
export const getAgeStudent = async (studentId: number): Promise<User[] | boolean> => {
    try {
        const result = await connection.select("*").from("student").where({ id: studentId });

        const resultModified = result.map((user: User) => {
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                age: ageFromDateOfBirthday(date_fmt(user.birth_date))
            };
        });

        return resultModified;
    } catch (error) {
        console.log(error);
        return false;
    }
};

// Get students by class
export const getStudentsByClass = async (turmaId: number): Promise<User[] | boolean> => {
    try {
        const result = await connection
            .select("id", "name", "email", "birth_date")
            .from("student")
            .where({ class_id: turmaId });

        const resultModified = result.map((user: User) => {
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                birthDate: date_fmt(user.birth_date)
            };
        });

        return resultModified;
    } catch (error) {
        console.log(error);
        return false;
    }
};

// Get students by same hobby
export const getStudentsByHobby = async (hobbyName: string): Promise<any> => {
    try {
        const result = await connection("hobbies")
            .join("student_hobby", "student_hobby.hobby_id", "hobbies.id")
            .join("student", "student.id", "student_hobby.student_id")
            .select("*")
            .where("hobbies.name", "like", `%${hobbyName}%`);

        const resultModified = result.map((user: User) => {
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                classId: user.class_id,
                birthDate: date_fmt(user.birth_date)
            };
        });

        return resultModified;
    } catch (error) {
        console.log(error);
        return false;
    }
};

// Find hobbies
export const findHobbies = async (hobbies: string[]): Promise<any> => {
    try {
        const result = await connection.select("*").from("hobbies").whereIn("name", hobbies);

        return result;
    } catch (error) {
        console.log(error);
        return false;
    }
};

// Add student in class
export const addInClass = async (userId: number, classId: number): Promise<boolean> => {
    try {
        await connection("student").update({ class_id: classId }).where({ id: userId });

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

//Create a Student
export const createUser = async (user: User): Promise<boolean> => {
    try {
        await connection("student").insert(user);

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

//Create Hobby
export const createHobby = async (hobby: Hobby): Promise<boolean> => {
    try {
        await connection("hobbies").insert(hobby);

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

//Create student hobbies
export const createStudentHobbies = async (studentId: number, hobbyId: number): Promise<boolean> => {
    try {
        await connection("student_hobby").insert({
            student_id: studentId,
            hobby_id: hobbyId
        });

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

// remove student the class
export const removeClass = async (studentId: number): Promise<boolean> => {
    try {
        await connection("student")
            .update({
                class_id: null
            })
            .where({ id: studentId });

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

// remove student
export const removeStudent = async (studentId: number): Promise<boolean> => {
    try {
        await connection("student").delete().where({ id: studentId });

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};
