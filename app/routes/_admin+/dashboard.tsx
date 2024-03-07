import { Button } from "~/features/Admin/UI/Button";
import { Card } from "~/features/Admin/UI/Card";

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <Card>
        <Card.Header>
          <Card.Title>Dashboard under construction.</Card.Title>
        </Card.Header>
        <Card.Body>
          <Button>Give us a star!</Button>
        </Card.Body>
      </Card>
    </div>
  );
}
