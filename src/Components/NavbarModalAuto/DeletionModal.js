function DeletionModal({ children, deleteSelectedRoute, route }) {
  return (
    <div>
      <p>{children}</p>
      <button onClick={(event) => deleteSelectedRoute(event, route)}>
        Löschen
      </button>
    </div>
  );
}

export default DeletionModal;
