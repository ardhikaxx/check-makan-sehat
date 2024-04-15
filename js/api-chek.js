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

                    let nutrientValue = "";
                    nutrition.forEach(nutrient => {
                        const value = nutrient.value || 0;
                        const unit = nutrient.unit || "";
                        nutrientValue += `${nutrient.nutrientName}: ${value}${unit}\n`;
                    });

                    swal({
                        title: "Hasil Cek Nutrisi",
                        text: `Makanan "${foodItem.description}" memiliki nilai gizi:\n${nutrientValue}`,
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