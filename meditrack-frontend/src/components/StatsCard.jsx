const StatsCard = ({ title, value, icon, variant = 'primary' }) => {
    return (
        <div className={`stats-card ${variant}`}>
            <div className="flex justify-between items-center">
                <div>
                    <div className="stats-value">{value}</div>
                    <div className="stats-label">{title}</div>
                </div>
                {icon && <div className="stats-icon" style={{ fontSize: '2.5rem', opacity: 0.3 }}>{icon}</div>}
            </div>
        </div>
    );
};

export default StatsCard;
