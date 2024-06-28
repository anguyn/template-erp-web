const BatchCriterias = [
    { "No": 1, "String": "a", "Type": "String", "Operation": "No Operation" },
    { "No": 2, "String": "12", "Type": "Number", "Operation": "Increase" }
];

const BatchAttribute1Criterias  = [];


const generateBatchNumbers = (batchCriterias, batchAttribute1Criterias, count) => {
    const batchNumbers = [];

    // Initialize the initial values for number criteria
    const batchNumberInitialValues = batchCriterias.map(criteria => {
        return {
            ...criteria,
            value: criteria.Type === "Number" ? parseInt(criteria.String, 10) : criteria.String
        };
    });

    const batchAttribute1InitialValues = batchAttribute1Criterias.map(criteria => {
        return {
            ...criteria,
            value: criteria.Type === "Number" ? parseInt(criteria.String, 10) : criteria.String
        };
    });

    for (let i = 0; i < count; i++) {
        // Generate Batch
        let batch = '';
        batchNumberInitialValues.forEach(criteria => {
            if (criteria.Type === "String") {
                batch += criteria.value;
            } else if (criteria.Type === "Number") {
                batch += criteria.value;
                if (criteria.Operation === "Increase") {
                    criteria.value++;
                } else if (criteria.Operation === "Decrease") {
                    // Decrease the value but do not go below 0
                    if (criteria.value > 0) {
                        criteria.value--;
                    }
                }
            }
        });

        // Generate BatchAttribute1
        let batchAttribute1 = '';
        batchAttribute1InitialValues.forEach(criteria => {
            if (criteria.Type === "String") {
                batchAttribute1 += criteria.value;
            } else if (criteria.Type === "Number") {
                batchAttribute1 += criteria.value.toString().padStart(criteria.String.length, '0');
                if (criteria.Operation === "Increase") {
                    criteria.value++;
                } else if (criteria.Operation === "Decrease") {
                    // Decrease the value but do not go below 0
                    if (criteria.value > 0) {
                        criteria.value--;
                    }
                }
            }
        });

        batchNumbers.push({
            Batch: batch,
            BatchAttribute1: batchAttribute1
        });
    }

    return batchNumbers;
};

// Example usage
const result = generateBatchNumbers(BatchCriterias, BatchAttribute1Criterias, 10);
console.log(result);
