var Utils;
(function (Utils) {
    /**
     * 将数值无单位符号的字节大小值转换为带有单位的字节大小值
     *
     * @param sizeL 无单位的字节大小值
    */
    function unitSize(sizeL) {
        var size = "";
        if (sizeL <= 1024) {
            size = sizeL + 'B';
        }
        else {
            size = sizeL / 1024 > 1024
                ? sizeL / (1024 * 1024) > 1024
                    ? (sizeL / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
                    : (sizeL / (1024 * 1024)).toFixed(2) + 'MB'
                : (sizeL / 1024).toFixed(2) + 'KB';
        }
        return size;
    }
    Utils.unitSize = unitSize;
})(Utils || (Utils = {}));
//# sourceMappingURL=Utils.js.map