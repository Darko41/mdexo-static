// Questionnaire JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const qForm = document.getElementById('questionnaire-form');
    const qStepForms = document.querySelectorAll('.step-form');
    const qSteps = document.querySelectorAll('.progress-container .step');
    const qProgress = document.querySelector('.progress');
    const qPrevBtn = document.getElementById('q-prev-btn');
    const qNextBtn = document.getElementById('q-next-btn');
    const qSubmitBtn = document.getElementById('q-submit-btn');
    const qRestartBtn = document.getElementById('q-restart-btn');
    const qResultContainer = document.getElementById('q-result-container');
    const qPriceElement = document.getElementById('q-price');
    const qDetailsTableBody = document.getElementById('q-details-table-body');
    const qWorkTypesError = document.getElementById('q-work-types-error');
    
    // Table elements
    const qBasePriceElement = document.getElementById('q-base-price');
    const qFloorsAdjustmentRow = document.getElementById('q-floors-adjustment-row');
    const qFloorsAdjustmentElement = document.getElementById('q-floors-adjustment');
    const qElevatorAdjustmentRow = document.getElementById('q-elevator-adjustment-row');
    const qElevatorAdjustmentElement = document.getElementById('q-elevator-adjustment');
    const qTotalPriceElement = document.getElementById('q-total-price');
    
    // Current step
    let qCurrentStep = 0;
    
    // Update buttons visibility
    function updateQButtons() {
        if (qCurrentStep === 0) {
            qPrevBtn.style.display = 'none';
        } else {
            qPrevBtn.style.display = 'block';
        }
        
        if (qCurrentStep === qStepForms.length - 1) {
            qNextBtn.style.display = 'none';
            qSubmitBtn.style.display = 'block';
        } else {
            qNextBtn.style.display = 'block';
            qSubmitBtn.style.display = 'none';
        }
    }
    
    // Update progress bar
    function updateQProgress() {
        qProgress.style.width = (qCurrentStep / (qStepForms.length - 1)) * 100 + '%';
        
        qSteps.forEach((step, index) => {
            if (index <= qCurrentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }
    
    // Show current step
    function showQStep(stepIndex) {
        qStepForms.forEach((step, index) => {
            if (index === stepIndex) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        
        qCurrentStep = stepIndex;
        updateQButtons();
        updateQProgress();
    }
    
    // Validate current step
    function validateQStep(stepIndex) {
        let isValid = true;
        const errorElement = document.getElementById(`q-${getQFieldId(stepIndex)}-error`);
        
        switch(stepIndex) {
            case 0:
                const area = document.getElementById('q-area').value;
                if (!area || area < 20 || area > 1000) {
                    isValid = false;
                    errorElement.style.display = 'block';
                } else {
                    errorElement.style.display = 'none';
                }
                break;
            case 1:
                const floors = document.getElementById('q-floors').value;
                if (!floors) {
                    isValid = false;
                    errorElement.style.display = 'block';
                } else {
                    errorElement.style.display = 'none';
                }
                break;
            case 2:
                const elevator = document.querySelector('input[name="q-elevator"]:checked');
                if (!elevator) {
                    isValid = false;
                    errorElement.style.display = 'block';
                } else {
                    errorElement.style.display = 'none';
                }
                break;
            case 3:
                const workTypes = document.querySelectorAll('input[name="q-work-types"]:checked');
                if (workTypes.length === 0) {
                    isValid = false;
                    qWorkTypesError.style.display = 'block';
                } else {
                    qWorkTypesError.style.display = 'none';
                }
                break;
        }
        
        return isValid;
    }
    
    // Get field ID for error message
    function getQFieldId(stepIndex) {
        switch(stepIndex) {
            case 0: return 'area';
            case 1: return 'floors';
            case 2: return 'elevator';
            case 3: return 'work-types';
            default: return '';
        }
    }
    
    // Calculate price
function calculateQPrice() {
    // Get values from form
    const area = parseInt(document.getElementById('q-area').value);
    const floors = parseInt(document.getElementById('q-floors').value);
    const elevator = document.querySelector('input[name="q-elevator"]:checked').value;
    const workTypes = document.querySelectorAll('input[name="q-work-types"]:checked');
    
    // Work type prices and labels
    const workTypePrices = {
        'q-vk-radovi': { price: 80, label: 'VK radovi' },
        'q-elektro-radovi': { price: 75, label: 'Radovi na elektroinstalacijama' },
        'q-gradevinski-radovi': { price: 45, label: 'Građevinski radovi' },
        'q-keramicki-radovi': { price: 95, label: 'Keramičarski radovi' },
        'q-parketarski-radovi': { price: 85, label: 'Parketarski radovi' },
        'q-spoljasnja-stolarija': { price: 90, label: 'Spoljašnja stolarija' },
        'q-unutrasnja-stolarija': { price: 35, label: 'Unutrašnja stolarija' },
        'q-moleraj': { price: 35, label: 'Moleraj' }
    };
    
    // Calculate base price from selected work types
    let basePrice = 0;
    let tableHTML = '';
    
    workTypes.forEach(workType => {
        const workTypeId = workType.id;
        const workTypePrice = workTypePrices[workTypeId].price;
        const workTypeLabel = workTypePrices[workTypeId].label;
        const workTypeTotal = area * workTypePrice;
        
        basePrice += workTypeTotal;
        
        // Only show work type names WITHOUT prices
        tableHTML += `
            <tr>
                <td>${workTypeLabel}</td>
            </tr>
        `;
    });
    
    // Calculate adjustments (3% instead of 15% and 10%)
    let floorsAdjustment = 0;
    let elevatorAdjustment = 0;
    
    // Adjust for floors - 3% per additional floor
    if (floors > 1) {
        floorsAdjustment = basePrice * ((floors - 1) * 0.03);
        basePrice += floorsAdjustment;
    }
    
    // Adjust for elevator - 3% if no elevator and multiple floors
    if (elevator === 'no' && floors > 1) {
        elevatorAdjustment = basePrice * 0.03;
        basePrice += elevatorAdjustment;
    }
    
    const totalPrice = basePrice;
    
    // Update table - only show selected work types (names only)
    qDetailsTableBody.innerHTML = tableHTML;
    qBasePriceElement.textContent = `${(totalPrice - floorsAdjustment - elevatorAdjustment).toFixed(2)}€`;
    qTotalPriceElement.textContent = `${totalPrice.toFixed(2)}€`;
    
    // Always hide adjustment rows as requested
    qFloorsAdjustmentRow.style.display = 'none';
    qElevatorAdjustmentRow.style.display = 'none';
    
    return totalPrice;
}
    
    // Event listeners
    qNextBtn.addEventListener('click', function() {
        if (validateQStep(qCurrentStep)) {
            showQStep(qCurrentStep + 1);
        }
    });
    
    qPrevBtn.addEventListener('click', function() {
        showQStep(qCurrentStep - 1);
    });
    
    qSubmitBtn.addEventListener('click', function() {
        if (validateQStep(qCurrentStep)) {
            // Calculate and display price
            const price = calculateQPrice();
            qPriceElement.textContent = `${price.toFixed(2)}€`;
            
            // Show result container, hide form
            qForm.style.display = 'none';
            qResultContainer.style.display = 'block';
        }
    });
    
    qRestartBtn.addEventListener('click', function() {
        // Reset form and show first step
        qForm.reset();
        showQStep(0);
        
        // Reset adjustment rows
        qFloorsAdjustmentRow.style.display = 'none';
        qElevatorAdjustmentRow.style.display = 'none';
        
        // Show form, hide result container
        qForm.style.display = 'block';
        qResultContainer.style.display = 'none';
    });
    
    // Initialize
    updateQButtons();
});