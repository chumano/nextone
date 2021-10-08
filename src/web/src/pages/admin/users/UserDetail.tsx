import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTimes,
    faSave
} from "@fortawesome/free-solid-svg-icons";
import { createNewUser, IUser } from "../../../utils";
import { useState } from "react";
import { getIsLoggedIn } from "../../../store";
import { useSelector } from "react-redux";
import { Col, Form, FormGroup, Input, Label, Row } from "reactstrap";

interface IProp {
    userData?: IUser,
    closeDetail?: () => void;
    saveData: (data: IUser) => void;
}
const UserDetail: React.FC<IProp> = ({
    userData,
    closeDetail,
    saveData
}) => {
    const newData: IUser = createNewUser();
    const [data, setData] = useState<IUser>(userData || newData);
    const isLoggedIn = useSelector(getIsLoggedIn);
    console.log("UserDetail", data);
    return <>
        <div className="object-detail">
            <div className="object-detail__head">
                <div className="object-detail__head--title page-title">
                    Thêm người dùng {isLoggedIn && "isLoggedIn"}
                </div>

                <div className="flex-spacer"></div>

                <div className="object-detail__head--actions">
                    <button className="button button-primary button--icon-label" onClick={() => { saveData(data) }} >
                        <FontAwesomeIcon icon={faSave} />
                        <span className="button-label">Lưu </span>
                    </button>

                    <button className="button button-link button--icon-label" onClick={closeDetail} >
                        <FontAwesomeIcon icon={faTimes} />
                        <span className="button-label">Close </span>
                    </button>
                </div>
            </div>
            <div className="object-detail__body">
                <Form>
                    <Row >
                        <Col md={6}>
                            <div className="mb-3">
                                <Label for="exampleEmail">Email</Label>
                                <Input type="email" name="email" id="exampleEmail" placeholder="with a placeholder" />
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="mb-3">
                                <Label for="examplePassword">Password</Label>
                                <Input type="password" name="password" id="examplePassword" placeholder="password placeholder" />
                            </div>
                        </Col>
                    </Row>
                    <div className="mb-3">
                        <Label for="exampleAddress">Address</Label>
                        <Input type="text" name="address" id="exampleAddress" placeholder="1234 Main St" />
                    </div>
                    <div  className="mb-3">
                        <Label for="exampleAddress2">Address 2</Label>
                        <Input type="text" name="address2" id="exampleAddress2" placeholder="Apartment, studio, or floor" />
                    </div>
                    <Row >
                        <Col md={6}>
                            <div className="mb-3">
                                <Label for="exampleCity">City</Label>
                                <Input type="text" name="city" id="exampleCity" />
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="mb-3">
                                <Label for="exampleState">State</Label>
                                <Input type="text" name="state" id="exampleState" />
                            </div>
                        </Col>
                        <Col md={2}>
                            <div className="mb-3">
                                <Label for="exampleZip">Zip</Label>
                                <Input type="text" name="zip" id="exampleZip" />
                            </div>
                        </Col>
                    </Row>
                    <div className="form-check mb-3">
                        <Input type="checkbox" name="check" id="exampleCheck" />
                        <Label for="exampleCheck" check>Check me out</Label>
                    </div>
                </Form>
            </div>
        </div>

    </>;
}

export default UserDetail;