import styled from "styled-components";

export const Styled = {
    FormWrapper: styled.div`
        width: min(100%, 1040px);
        margin: 0 auto;
        padding: clamp(22px, 4vw, 42px);
        border: 1px solid #d8e0ea;
        border-radius: 18px;
        background: #fff;
        box-shadow: 0 18px 45px rgba(31, 45, 68, 0.09);
        .intro { max-width: 760px; margin: 12px auto 24px; color: #657287; text-align: center; }
        .featuresUseCasesWrapper { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; margin: 24px 0 30px; }
        .features, .useCases { padding: 18px; color: #172033; border: 1px solid #e3e8ef; border-radius: 13px; background: #f9fbfd; }
        .features ul, .useCases ul { margin: 10px 0 0 18px; color: #657287; }
        .features li, .useCases li { margin: 5px 0; }
        .features a, .useCases a { color: #087f73; }
        @media (max-width: 700px) { .featuresUseCasesWrapper { grid-template-columns: 1fr; } }
    `,
    Form: styled.form`
        scroll-margin-top: 90px;
    `,
    InputsWrapper: styled.div`
        display: flex;
        flex-wrap: wrap;
        gap: 14px;
        margin-bottom: 8px;
        .input { flex: 1 1 300px; }
        .uploadResumeButton { width: 100%; justify-content: flex-start; }
    `,
    ButtonRow: styled.div`
        display: flex;
        justify-content: space-between;
        gap: 12px;
        margin-top: 18px;
        @media (max-width: 430px) { flex-direction: column-reverse; }
    `,
};
