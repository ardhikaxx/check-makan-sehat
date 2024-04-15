document.addEventListener("DOMContentLoaded", function () {
    document.querySelector('.btn-check').addEventListener('click', function () {
        swal({
            text: 'Masukkan nama makanan dalam bahasa Inggris:',
            content: "input",
            button: {
                text: "Cek",
                closeModal: false,
            },
        })
        .then((inputValue) => {
            if (inputValue === "") {
                swal("Anda harus memasukkan makanan!", {
                    icon: "error",
                });
                return;
            }

            fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${inputValue}&api_key=qyV60JbMIVfjPB0QeLnQ90vGKtmoe0UQjzigyLdS`)
            .then(response => response.json())
            .then(data => {
                if (data.foods.length === 0) {
                    swal("Makanan tidak ditemukan!", {
                        icon: "error",
                    });
                } else {
                    const foodItem = data.foods[0];
                    const nutrition = foodItem.foodNutrients;

                    let tableHtml = "<table style='margin:auto; border-collapse: collapse; text-align: center;'><tr><th style='border: 1px solid black; padding: 8px;'>Nama Nutrisi</th><th style='border: 1px solid black; padding: 8px;'>Nilai</th></tr>";
                    nutrition.forEach(nutrient => {
                        const value = nutrient.value || 0;
                        const unit = nutrient.unit || "";
                        tableHtml += `<tr><td style='border: 1px solid black; padding: 8px;'>${nutrient.nutrientName}</td><td style='border: 1px solid black; padding: 8px;'>${value}</td></tr>`;
                    });
                    tableHtml += "</table>";

                    swal({
                        title: "Hasil Cek Nutrisi",
                        content: {
                            element: "div",
                            attributes: {
                                innerHTML: `
                                    <p style='margin-bottom: 16px;'>Makanan "${foodItem.description}" memiliki nilai gizi:</p>
                                    ${tableHtml}
                                `
                            }
                        },
                        icon: "success",
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                swal("Terjadi kesalahan saat memproses permintaan.", {
                    icon: "error",
                });
            });
        });
    });
});