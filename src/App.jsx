import ApiAxio from "./ApiAxio";
import Card from "./Card";

function App() {
  const users = [
    {
      "Name": "John Doe",
      "Profession": "Software Engineer",
      "Email": "john.doe@example.com",
      "Mobile": "+1 555-1234",
      "Age": 28
    },
    {
      "Name": "Jane Smith",
      "Profession": "Graphic Designer",
      "Email": "jane.smith@example.com",
      "Mobile": "+1 555-5678",
      "Age": 32
    },
    {
      "Name": "David Johnson",
      "Profession": "Marketing Manager",
      "Email": "david.johnson@example.com",
      "Mobile": "+1 555-9876",
      "Age": 40
    },
    {
      "Name": "Emily Davis",
      "Profession": "Data Analyst",
      "Email": "emily.davis@example.com",
      "Mobile": "+1 555-4321",
      "Age": 26
    },
    {
      "Name": "Michael Brown",
      "Profession": "Project Manager",
      "Email": "michael.brown@example.com",
      "Mobile": "+1 555-8765",
      "Age": 35
    }
  ];

  return (
    // <div className="p-10">
    //   {/* Corrected the map function to return the Card component */}
    //   {users.map((user, idx) => (
    //     <Card 
    //       key={idx}
    //       user={user} // Pass the entire user object as a prop
    //     />
    //   ))}
    // </div>
    <div className="p-20">
    <ApiAxio/>
    </div>
  );
}

export default App;
