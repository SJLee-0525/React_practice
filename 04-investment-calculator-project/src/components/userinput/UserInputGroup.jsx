import UserInput from "./UserInput.jsx"

export default function UserInputGroup({ investmentData, onChangeInputValue }) {
  return (
    <section id="user-input">
      <div className="input-group">
        <UserInput data={investmentData.initialInvestment} inputName="initialInvestment" onChangeInputValue={onChangeInputValue}>
          INITIAL INVESTMENT
        </UserInput>
        <UserInput data={investmentData.annualInvestment} inputName="annualInvestment" onChangeInputValue={onChangeInputValue}>
          ANNUAL INVESTMENT
        </UserInput>
      </div>
      <div className="input-group">
        <UserInput data={investmentData.expectedReturn} inputName="expectedReturn" onChangeInputValue={onChangeInputValue}>
          EXPECTED RETURN
        </UserInput>
        <UserInput data={investmentData.duration} inputName="duration" onChangeInputValue={onChangeInputValue}>
          DURATION
        </UserInput>
      </div>
    </section>
  )
}
