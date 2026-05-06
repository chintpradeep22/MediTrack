const Badge = ({ status, text }) => {
    const getStatusClass = () => {
        switch (status?.toUpperCase()) {
            case 'PENDING':
                return 'badge-pending';
            case 'GIVEN':
                return 'badge-given';
            case 'MISSED':
                return 'badge-missed';
            default:
                return 'badge-primary';
        }
    };

    return (
        <span className={`badge ${getStatusClass()}`}>
            {text || status}
        </span>
    );
};

export default Badge;
