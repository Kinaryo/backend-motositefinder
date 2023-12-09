// Ekspor middleware sebagai sebuah fungsi yang menerima fungsi asinkron sebagai argumen
module.exports = func => {
    // Fungsi middleware yang menerima req, res, dan next
    return (req, res, next) => {
        // Memanggil fungsi asinkron yang diberikan sebagai argumen
        // dan menangkap error dengan menggunakan .catch(next)
        func(req, res, next).catch(next);
    };
};
