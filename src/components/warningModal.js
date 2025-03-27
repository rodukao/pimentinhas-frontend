import React from "react";
import './WarningModal.css';

function WarningModal({show, onClose, onConfirm}){
    if (!show){
        return null;
    }

    return(
        <div className="modal-backdrop">
            <div className="modal-content">
                <h4 className="warning-title">Atenção!</h4>
                <p>
                    Você selecionou o nível 5. As perguntas neste nível podem conter
                    conteúdo explícito, pessoal ou potencialmente desconfortável.
                </p>
                <p>Tem certeza que deseja continuar?</p>
                <div className="modal-actions">
                    <button onClick={onClose} className="botao-cancelar">
                        Não, to com medo
                    </button>
                    <button onClick={onConfirm} className="botao-confirmar">
                        Sim, nem ligo
                    </button>
                </div>
            </div>
        </div>
    );
}

export default WarningModal;