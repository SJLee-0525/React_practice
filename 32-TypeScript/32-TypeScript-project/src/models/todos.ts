class Todo {
  id: string
  text: string

  constructor(todoText: string) {
    this.id = new Date().toISOString()
    this.text = todoText
  }
}

export default Todo

// interface 사용
// interface Todo {
//     id: string;
//     text: string;
//   }

//   // type 사용
//   type Todo = {
//     id: string;
//     text: string;
//   };

//   // 객체를 생성하는 함수
//   const createTodo = (todoText: string): Todo => ({
//     id: new Date().toISOString(),
//     text: todoText,
//   });

//   export { Todo, createTodo };

// 1. 객체 생성 방식
// class를 사용하면 new Todo("할 일") 형태로 객체를 생성할 수 있음.
// interface나 type을 사용하면 createTodo("할 일") 같은 별도의 팩토리 함수를 만들어야 함.
// 2. 인스턴스 메서드
// class는 메서드를 포함할 수 있어 Todo 내부에 printTodo() 같은 메서드를 추가할 수 있음.
// interface나 type은 순수한 데이터 구조이므로 메서드를 포함할 수 없고, 따로 유틸 함수를 만들어야 함.
// 3. 확장성
// interface는 다른 interface를 extends로 확장할 수 있음.
// type은 & 연산자로 확장 가능하지만 extends처럼 계층적으로 설계하는 데는 interface가 더 적합함.
// class는 상속(extends)과 함께 생성자와 메서드를 활용한 객체 지향적인 접근이 가능함.
// 4. 런타임 영향
// class는 자바스크립트에서 실제 함수로 변환되므로 런타임에도 존재하지만,
// interface와 type은 컴파일 타임에만 존재하고 런타임에서는 사라짐.
// 따라서 interface나 type을 사용하면 더 가벼운 코드가 됨.
// 결론

// 단순한 데이터 구조라면 interface나 type이 더 적합함.
// 객체 지향적인 설계가 필요하다면 class를 사용하는 것이 좋음.
