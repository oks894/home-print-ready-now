
interface JobNotesProps {
  notes: string;
}

export const JobNotes = ({ notes }: JobNotesProps) => {
  if (!notes) {
    return null;
  }

  return (
    <div>
      <h4 className="font-medium mb-2 text-sm sm:text-base">Special Instructions</h4>
      <p className="text-xs sm:text-sm text-gray-600 p-2 sm:p-3 bg-gray-50 rounded break-words">
        {notes}
      </p>
    </div>
  );
};
