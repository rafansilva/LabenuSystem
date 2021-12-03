import { Router } from "express";

//Endpoints
import {
    addStudentInClassApp,
    addTeacherInClassApp,
    changeModuleClass,
    createTeacherApp,
    createTurmaApp,
    createUserApp,
    getAllClassApp,
    getClassByIdApp,
    removeStudentApp,
    removeStudentTheClass,
    removeTeacherTheClass,
    showStudentsAge,
    showStudentsByClass,
    showStudentsByHobby,
    showTeachersByClass
} from "../app/app";

const router: Router = Router();

router.get("/class", getAllClassApp);
router.get("/class/:id", getClassByIdApp);
router.get("/students/hobby", showStudentsByHobby);
router.get("/students/class/:id", showStudentsByClass);
router.get("/students/age/:id", showStudentsAge);
router.get("/teachers/class/:id", showTeachersByClass);

router.post("/students", createUserApp);
router.post("/students/addclass", addStudentInClassApp);

router.post("/teachers", createTeacherApp);
router.post("/teachers/addclass", addTeacherInClassApp);

router.post("/class", createTurmaApp);

router.put("/students/removeclass", removeStudentTheClass)
router.put("/teachers/removeclass", removeTeacherTheClass);
router.put("/class/module", changeModuleClass);

router.delete("/students/:id", removeStudentApp)

export default router;
