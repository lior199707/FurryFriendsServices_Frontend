import React, {useState, useEffect} from "react";
import {Button, Card, Container, Row, Col, Form} from "react-bootstrap";
import "../../styles/ClientStyles/Appointments.css";
import {useAuth} from "../../context/AuthContext.jsx";
import axios from "axios";

/**
 *
 * @return {React.Component} Appointments for a specific client
 */
function Appointments() {
    const [appointments, setAppointments] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedType, setSelectedType] = useState("Upcoming");
    const [selectedSort, setSelectedSort] = useState("Sort by date");
    const {userData} = useAuth();


    useEffect(()=> {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get(`client/get-appointments/${userData?.id}`);
                setAppointments(response.data.appointments);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, [userData.id]);

    const cancelAppointment = async (appointmentId) => {
        try {
            const response = await axios.delete(`appointment/delete-appointment/${appointmentId}`);
            const updatedAppointments = appointments.map((appointment) => {
                if (appointment._id === appointmentId) {
                    return {
                        ...appointment,
                        status: response.data.appointment.status,
                    };
                }
                return appointment;
            });

            setAppointments(updatedAppointments);
        } catch (err) {
            setError("Failed to cancel the appointment.");
        }
    };

    /**
     * Sorting function, can sort by date/price(descending and ascending order) and by name. depends on input value.
     * Sort by date
     * Sort by price - descending
     * Sort by price - ascending
     * Sort by service provider name
     * @param {*} e
     */
    const sortByChoice = (e) => {
        console.log(e.target.value);
        setSelectedSort(e.target.value);
        if (e.target.value === "Sort by date") {
            appointments.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else if (e.target.value.includes("Sort by price")) {
            if (e.target.value.includes("descending")) {
                appointments.sort((a, b) => b.appointmentType.price - a.appointmentType.price);
            } else {
                appointments.sort((a, b) => a.appointmentType.price - b.appointmentType.price);
            }
        } else if (e.target.value === "Sort by service provider name") {
            appointments.sort((a, b) => a.serviceProviderId.name.localeCompare(b.serviceProviderId.name));
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <Container className="appointments-container">
            <Row>
                <Col md={12} className="appointment-column">
                    <Form.Control
                        as="select"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                    >
                        <option>Upcoming</option>
                        <option>Completed</option>
                        <option>Canceled</option>
                    </Form.Control>
                    <Form.Control
                        as="select"
                        value={selectedSort}
                        onChange={sortByChoice}
                    >
                        <option>Sort by date</option>
                        <option>Sort by price - descending</option>
                        <option>Sort by price - ascending</option>
                        <option>Sort by service provider name</option>
                    </Form.Control>
                    <h2 style={{color: "white"}}>{selectedType} Appointments </h2>
                    {appointments.filter((appointment) => appointment.status === selectedType).map((appointment) => (
                        <Card key={appointment._id} className="mb-3">
                            <Card.Body>
                                <div className="div-container">
                                    <Row>
                                        Date&Time:  {appointment.date.replace(/[TZ]/g, " ").substring(0, appointment.date.length - 8)}
                                    </Row>
                                    <Row>
                                        <Col md={5} className="appointment-column">
                                            Provider: {appointment.serviceProviderId.name}
                                        </Col>
                                        <Col md={7} className="appointment-column">
                                            Type: {appointment.appointmentType.name}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={5} className="appointment-column">
                                            Duration: {appointment.duration}h
                                        </Col>
                                        <Col md={5} className="appointment-column">
                                            Price: {appointment.appointmentType.price}$
                                        </Col>
                                    </Row>
                                    {selectedType === "Upcoming" && (
                                        <Button className="cancel-button" variant="danger" onClick={() => cancelAppointment(appointment._id)}>Cancel</Button>
                                    )}
                                </div>
                            </Card.Body>
                        </Card>
                    ))}
                </Col>
            </Row>
        </Container>
    );
}

export default Appointments;
