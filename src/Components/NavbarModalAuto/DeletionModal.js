function DeletionModal({ children, deleteSelectedRoute, route }) {
  console.log(route);
  return (
    <div>
      <p>{children}</p>
      <button onClick={(e) => deleteSelectedRoute(e, route)}>Löschen</button>
    </div>
  );
}

export default DeletionModal;
