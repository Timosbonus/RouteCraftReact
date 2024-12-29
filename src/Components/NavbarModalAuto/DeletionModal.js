function DeletionModal({ children, deleteSelectedRoute, route }) {
  console.log("heeey");
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
