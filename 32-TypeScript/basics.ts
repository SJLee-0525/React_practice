// 기본형
// 타입 스크립트에서는 number와 string 표기가 소문자로 시작됨

// 숫자
let age: number = 24;

// 문자
let userName: string;
userName = "sungjoon";

// 논리
let isInstructor: boolean = true;

let isMarried: null;

// 참조형
// 배열
let hobbies: string[];
hobbies = ["Sports", "Cooking"];

// any: 어떤 값이든 다 저장됨
// let person;
// person = {
//   name: "Max",
//   age: 32,
// };

// 객체
let person: {
  name: string;
  age: number;
};

person = {
  name: "Max",
  age: 32,
};

// 여러 객체를 가진 배열 생성
let people: {
  name: string;
  age: number;
}[];

// 타입 추론
// 위에서는 변수를 선언하면서 타입을 지정하고 값을 할당하거나 동시에 설정했음
// 아래 처럼 변수를 바로 만들고 초기화하면, 타입 스크립트는 할당된 값의 자료형을 보고, 이 자료형을 해당 변수의 타입으로 여긺
let course = "React";

course = "123";
// course = 123

// 다양한 유형의 변수 저장하기: 유니온 타입
let course2: string | number | boolean = "React 2";

course2 = "123";
course2 = 123;
course2 = false;

// 타입 별칭 : Type Alias
// 반복해서 타입을 정의하는 대신에 기본 타입을 정의해 두고, 그 타입 별칭을 사용하는 것
type Student = {
  name: string;
  age: number;
};

let student1: Student = {
  name: "std1",
  age: 12,
};
let student2: Student[] = [
  {
    name: "std1",
    age: 12,
  },
  {
    name: "std2",
    age: 10,
  },
];

// 함수와 타입
// 함수(매개 변수): 리턴 값 타입
function add(a: number, b: number): number {
  return a + b;
}

// 반환 값이 없는 함수
// void는 null, undefined와 비슷하지만, 항상 함수와 결합해서 사용함
function personalPrint(value: any): void {
  console.log(value);
}

// 제너릭 Generics

// 함수를 호출하면 타입 스크립트는 인수의 정확한 값을 파악해야 한다는 것을 알 수 있음
// any 타입이 아니라는 점을 알려줬고, array와 value값이 같은 값을 가져야 한다는 것도 알 수 있음
// 들어온 값이 숫자 배열과 숫자인 것을 확인하고, 논리적으로 리턴 값이 숫자 배열이라는 것을 파악
function insertAtBeginning<T>(array: T[], value: T) {
  const newArray = [value, ...array];
  return newArray;
}

const demoArray = [1, 2, 3];
const updatedArray = insertAtBeginning(demoArray, -1); // number[]
