const About = () => {
  return (
    <div className="max-w-2xl mx-auto p-6  rounded-lg shadow-md">
      <h1 className="text-3xl font-bold  text-green-600 mb-6">
        Asset Management App
      </h1>
      <p className=" text-lg  mb-8">
        Efficiently Manage Your Properties & Renters
      </p>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold  mb-2">Key Features</h2>
        <ul className="list-disc list-inside ">
          <li>
            <strong>Property Management:</strong> Track land, houses, and
            occupancy status.
          </li>
          <li>
            <strong>Renter Management:</strong> Store renter details and payment
            history.
          </li>
          <li>
            <strong>Rent Collection & Tracking:</strong> Automate reminders and
            rent reports.
          </li>
          <li>
            <strong>Manager Assignments:</strong> Assign and track property
            managers.
          </li>
          <li>
            <strong>CRUD Functionality:</strong> Create, Read, Update, and
            Delete records.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold  mb-2">Benefits</h2>
        <ul className="list-disc list-inside ">
          <li>Centralized property management with easy access.</li>
          <li>Time-saving automation for rent collection.</li>
          <li>Improved accountability through manager assignments.</li>
          <li>Secure and accessible from anywhere.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold  mb-2">How It Works</h2>
        <ol className="list-decimal list-inside ">
          <li>Register & Login securely.</li>
          <li>Add Properties with all necessary details.</li>
          <li>Add Renters and track their leases.</li>
          <li>Monitor Rent Collection & overdue payments.</li>
          <li>Assign Managers and define their responsibilities.</li>
          <li>Generate Reports for financial insights.</li>
        </ol>
      </section>

      <section className="">
        <p className="text-lg  font-medium">
          Our Asset Management App ensures{" "}
          <strong>efficiency, security, and profitability.</strong>
        </p>
        <p className=" mt-2">
          Try it today and simplify your property management process!
        </p>
      </section>
    </div>
  );
};

export default About;
