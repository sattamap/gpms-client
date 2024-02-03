import { Link } from 'react-router-dom';

const AboutGPMS = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-3xl mx-auto p-8 bg-white shadow-md rounded-md">
                <Link to="/dashboard" className="block text-blue-500 hover:underline mb-4">&larr; Back to Dashboard</Link>
                <h2 className="text-2xl font-semibold mb-4">About GPMS</h2>
                <p className="mb-4">
                    GPMS (Gate Pass Management System) is a web application designed to manage gate pass requests and visitor management within an organization. It provides different levels of access and functionalities based on the user&apos;s role or status within the system.
                </p>
                <p className="mb-4">
                    When a user registers for the first time, their status is set to &quot;No Role&quot; by default. The system supports four types of users:
                </p>
                <ul className="list-disc pl-8 mb-4">
                    <li><strong>Admin:</strong> Admin users have full control over the system. They can manage both users and visitors and view active visitors.</li>
                    <li><strong>Coordinator:</strong> Coordinator users can add visitors who come to the office and manage visitors.</li>
                    <li><strong>Monitor:</strong> Monitor users can only view active visitors.</li>
                    <li><strong>No Role:</strong> Users with no role assigned are unable to access or perform any actions within the system.</li>
                </ul>
                <p>
                    GPMS aims to streamline gate pass requests, enhance visitor management, and provide an efficient way for organizations to manage access to their premises.
                </p>
            </div>
        </div>
    );
};

export default AboutGPMS;
