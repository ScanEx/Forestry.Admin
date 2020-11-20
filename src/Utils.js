const format_date_iso = s => {
    return new Date(`${s}+00:00`).toLocaleDateString();
};

export {format_date_iso};