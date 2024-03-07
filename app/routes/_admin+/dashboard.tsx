import { Button } from "~/features/Admin/UI/Button";
import { Card } from "~/features/Admin/UI/Card";

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <Card className="max-w-md">
        <Card.Header>
          <Card.Title>Thank You For Joining Us!</Card.Title>
          <Card.Subtitle>You are one of the best supporters!</Card.Subtitle>
        </Card.Header>
        <Card.Body className="space-y-5">
          <p className="leading-relaxed">
            We are excited to have you on board.
          </p>
          <Button>Give Support On Github!</Button>
        </Card.Body>
      </Card>
    </div>
  );
}
