## LabenuSystem:

É um sistema simples que representa o básico da escola digital [Labenu](https://www.labenu.com.br/).

## URL:
- https://labesystem5.herokuapp.com/

## ENDPOINTS


### **Endpoint**: Criar Turma

-   **Método:** POST
-   **Path:** `/class`
-   **Body de Exemplo:**

```json
{
    "name": "Lovelace",
    "module": 4,
    "period": "integral",
    "initialDate": "07/06/2021",
    "finalDate": "13/12/2021"
}
```

---

### **Endpoint**: Criar Estudantes

-   **Método:** POST
-   **Path:** `/students`
-   **Body de Exemplo:**

```json
{
    "name": "Alexandre",
    "email": "ale@email.com",
    "birthDate": "24/12/1998",
    "hobbies": ["jogar videogame", "assistir filmes", "assistir series", "programar"]
}
```

---

### **Endpoint**: Criar Docente

-   **Método:** POST
-   **Path:** `/teachers`
-   **Body de Exemplo:**

```json
{
    "name": "Darvas",
    "email": "darvas@email.com",
    "birthDate": "12/07/1997",
    "specialtyName": ["typescript", "testes", "react", "backend"]
}
```

---

### **Endpoint**: Pegar todas as turmas

-   **Método:** GET
-   **Path:** `/class`

---

### **Endpoint**: Adicionar estudante na turma

-   **Método:** POST
-   **Path:** `/students/addclass?studentId=4407&classId=3474`
-   **Query String:** indica o id do estudante através da chave `studentId` e o id da turma através da chave `classId`

---

### **Endpoint**: Adicionar docente na turma

-   **Método:** POST
-   **Path:** `/teachers/addclass?teacherId=8799&classId=4778`
-   **Query String:** indica o id do docente através da chave `teacherId` e o id da turma através da chave `classId`

---


### **Endpoint**: Pegar a idade de algum estudante a partir do id

-   **Método:** GET
-   **Path:** `/students/age/:id`
-   **Path Param**: é o id do estudante

---


### **Endpoint**: Pegar turma pelo id e listar docentes e estudantes dessa turma

-   **Método:** GET
-   **Path:** `/class/:id`
-   **Path Param**: é o id da turma

---

### **Endpoint**: Exibir estudantes de uma turma

-   **Método:** GET
-   **Path:** `/students/class/:id`
-   **Path Param**: é o id da turma

---

### **Endpoint**: Exibir docentes de uma turma

-   **Método:** GET
-   **Path:** `/teachers/class/:id`
-   **Path Param**: é o id da turma

---

### **Endpoint**: Exibir estudantes que possuam o mesmo hobby

-   **Método:** GET
-   **Path:** `/students/hobby?hobbyName=programar`
-   **Query String:** indica o nome do hobby através da chave `hobbyName`

---

### **Endpoint**: Remover estudante de uma turma

-   **Método:** PUT
-   **Path:** `/students/removeclass?studentId=6653&classId=4490`
-   **Query String:** indica o id do estudante através da chave `studentId` e o id da turma através da chave `classId`

---

### **Endpoint**: Remover estudante

-   **Método:** DELETE
-   **Path:** `/students/:id`
-   **Query String:** indica o id do estudante através da chave `studentId`

---

### **Endpoint**: Remover docente de uma turma

-   **Método:** PUT
-   **Path:** `/teachers/removeclass?teacherId=8799&classId=4778`
-   **Query String:** indica o id do docente através da chave `teacherId` e o id da turma através da chave `classId`

---

### **Endpoint**: Mudar turma de módulo

-   **Método:** PUT
-   **Path:** `/class/module?id=3701&module=5`
-   **Query String:** indica o id da turma através da chave `id` e o módulo da turma através da chave `module`


## Créditos
- [Rafael N. Silva](https://github.com/rafansilva) (Developer)
- [Erlan Carvalho](https://github.com/Carvalho001) (Developer)
- [Labenu](https://www.labenu.com.br/) (Turma Lovalace)
