import React from "react";
import CreateAccount from "../components/CreateAccount";
import ViewAccount from "../components/ViewAccount";
import Card from "../ui/Card";

export default function AccountsPage() {
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-10">
      <h1 className="text-3xl font-bold text-center">Accounts</h1>

      <Card>
        <CreateAccount />
      </Card>

      <Card>
        <ViewAccount />
      </Card>
    </div>
  );
}
