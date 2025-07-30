import styled from "styled-components";

export const Styled = {
    FormWrapper: styled.div`
        border: 1px solid #000;
        max-width: 900px;
        margin: 2rem auto;
        padding: 2rem;
        border-radius: 12px;
        background-color: #fff;

        .featuresUseCasesWrapper {
            display: flex;
            justify-content: space-between;
            gap: 30px;
            flex-wrap: wrap;
            margin-top: 15px;

            .features,
            .useCases {
                margin-bottom: 30px;

                ul {
                    li {
                    }
                }
            }
        }
    `,

    Form: styled.form``,
    InputsWrapper: styled.div`
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        margin-bottom: 15px;

        .input {
            flex: 1 0 300px;
        }

        .uploadResumeButton {
            width: 100%;
        }
    `,

    ButtonRow: styled.div`
        display: flex;
        justify-content: space-between;
        margin-top: 1.5rem;
    `,

    LiveLinks: styled.div``,
};
