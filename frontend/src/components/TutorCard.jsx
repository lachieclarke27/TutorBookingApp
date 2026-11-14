const TutorCard = ({ tutor }) => {
    return (
        <div className="border rounded-lg p-5 shadow hover:shadow-lg transition">
            <h2 className="text-xl font-bold mb-2">
                {tutor.tutor?.name}
            </h2>

            <p className="text-gray-600 mb-3">
                {tutor.description}
            </p>

            <p className="mb-2">
                <strong>Subjects:</strong>{' '}
                {tutor.subjects.join(', ')}
            </p>

            <p>
                <strong>Hourly Rate:</strong> $
                {tutor.hourlyRate.toFixed(2)} / hour
            </p>
        </div>
    );
};

export default TutorCard;