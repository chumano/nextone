import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTimes,
    faSave
} from "@fortawesome/free-solid-svg-icons";
import { createNewUser, IUser, useEnvDev } from "../../../utils";
import { useEffect, useState } from "react";
import { getIsLoggedIn } from "../../../store";
import { useSelector } from "react-redux";
import { Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import ReactJson from "react-json-view";
import { useForm } from "react-hook-form";
import ErrorSummary, { addServerErrors } from "../../../components/error-summary/ErrorSummary";
import ErrorMessage from "../../../components/error-summary/ErrorMessage";

interface IProp {
    userData?: IUser,
    closeDetail: () => void;
    saveData: (data: IUser) => void;
}
const UserDetail: React.FC<IProp> = ({
    userData,
    closeDetail,
    saveData
}) => {
    const newData: IUser = createNewUser();
    const [data, setData] = useState<IUser>(userData || newData);
    const [isAdd, _] = useState<boolean>(!data.id);
    const isDev = useEnvDev();
    const isLoggedIn = useSelector(getIsLoggedIn);
    //https://react-hook-form.com/api/useform/setFocus
    const { register, handleSubmit, formState: { errors , isDirty , dirtyFields, isSubmitted, isValid, submitCount}, setError,
        getValues, clearErrors, control, reset, setValue, setFocus, watch, trigger, unregister } = useForm({
            defaultValues: data
        });

    const submitForm = async (data: any) => {
        console.log("formData", data);
        const result = {
            errors: {
                name: ["The name is exist"],
                email: ["The email is invalid"]
            }
        }
        addServerErrors(result.errors, setError);
    };

    const onSubmit = handleSubmit(submitForm);

    const onSaveClick = () => {

        onSubmit();
        //saveData(data);
    }

    useEffect(() => {
        setFocus("name");
    }, [setFocus]);

    const onCloseClick = () => {
        //Loi :https://github.com/react-hook-form/react-hook-form/issues/6754
        //setFocus("isActive");
        closeDetail();
    }


    return <>
        <div className="object-detail">
            <div className="object-detail__head">
                <div className="object-detail__head--title page-title">
                    {isAdd ? "Thêm người dùng" : "Thông tin người dùng"}
                </div>

                <div className="flex-spacer"></div>

                <div className="object-detail__head--actions">
                    <button className="button button-primary button--icon-label" onClick={onSaveClick} >
                        <FontAwesomeIcon icon={faSave} />
                        <span className="button-label">Lưu </span>
                    </button>

                    <button className="button button-link button--icon-label" onClick={onCloseClick} >
                        <FontAwesomeIcon icon={faTimes} />
                        <span className="button-label">Close </span>
                    </button>
                </div>
            </div>
            <div className="object-detail__body">
                <form >
                    <Row >
                        <Col md={6}>
                            <div className="mb-3">
                                <Label for="userName">Tên</Label>
                                <input type="text" id="userName" placeholder="userName placeholder" className="form-control"
                                    {...register("name", { required: { value: true, message: "You must enter your name" } })} />
                                <ErrorMessage errors={errors} name={"name"} as="div" className="error-message" />
                            </div>
                        </Col>
                        <div className="col-md-6">
                            <ErrorSummary errors={errors} />
                        </div>
                    </Row>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <Label for="userEmail">Email</Label>
                            <input type="email" autoComplete="off" id="userEmail" placeholder="with a placeholder" className="form-control"
                                {...register("email", { required: { value: true, message: "You must enter your email" } })} />
                            <ErrorMessage errors={errors} name={"email"} as="div" className="error-message" />
                        </div>
                    </div>
                    <div className="form-check mb-3">
                        <input type="checkbox" id="userCheck" className="form-check-input"
                            {...register("isActive")} />
                        <Label for="userCheck" check>Kích hoạt?</Label>
                    </div>
                </form>
            </div>
        </div>

        {isDev && <ReactJson src={getValues()} />}

    </>;
}

export default UserDetail;