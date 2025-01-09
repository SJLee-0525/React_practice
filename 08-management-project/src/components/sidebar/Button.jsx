export default function Button ({children, ...props}) {
    // 부모 컴포넌트에서 onClick에 제공한한 함수를 ...props가 받아서 button에 펼쳐 연결 구조를 완성성
    return (
        <button className="px-4 py-2 text-xs md:text-base rounded-md bg-stone-700 text-stone-200 hover:bg-orange-500 hover:text-stone-100 hover:transition-all" {...props}>
            {children}
        </button>
    )
}