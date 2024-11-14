import { useState } from "react";
import Navbar from "./Navbar";
import Modal from "./Modal";

function RouteOverviewComponent({ routeId, setRouteId }) {
  const [isModalOpen, setModalOpen] = useState(false); // state for current modal state

  return (
    <>
      <Navbar routeId={routeId} setModalOpen={setModalOpen}></Navbar>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <h2>Modal Title</h2>
        <p>This is a simple modal.</p>
      </Modal>
    </>
  );
}

export default RouteOverviewComponent;
