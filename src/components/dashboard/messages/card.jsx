import React from 'react';
import {Card} from 'react-bootstrap';
import moment from 'moment'; // librarie pt timp

const CardMessage = ({data}) => (
    <Card className="mt-3">
        <Card.Header>
            <small>Sent: {moment.unix(data.createdAt.seconds).format("MM/DD/YYYY")}</small>
        </Card.Header>
        <Card.Body>
            <Card.Title>From: {data.name} ({data.email})</Card.Title>
            <Card.Text>
                {data.message}
            </Card.Text>
        </Card.Body>
    </Card>
)

export default CardMessage;