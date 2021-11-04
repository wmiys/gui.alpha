


class CountUp
{
    constructor(eElement) {
        this.element = eElement;

        this.value         = null;
        this.duration      = null;
        this.decimalPlaces = null;
        this.prefix        = null;

        this._setValues();
    }

    _setValues = () => {
        this.value         = this._getDataAttributeValue(CountUp.DataAttributes.value, 0);
        this.duration      = this._getDataAttributeValue(CountUp.DataAttributes.duration, CountUp.Defaults.duration);
        this.decimalPlaces = this._getDataAttributeValue(CountUp.DataAttributes.decimalPlaces, CountUp.Defaults.decimalPlaces);
        this.prefix        = this._getDataAttributeValue(CountUp.DataAttributes.prefix, CountUp.Defaults.prefix);
    }

    _getDataAttributeValue = (dataAttributeKey, defaultValue=null) => {
        const val = $(this.element).attr(dataAttributeKey);
        return val == undefined ? defaultValue : val;
    }

    start = () => {
        const options = this._getOptionsDict();
        var numAnim = new countUp.CountUp(this.element, this.value, options);
        numAnim.start();
    }

    _getOptionsDict = () => {
        return {
            decimalPlaces: this.decimalPlaces,
            duration: this.duration,
            prefix: this.prefix,
        }

    }
}

CountUp.DataAttributes = {
    value:          'data-countup-value',
    duration:       'data-countup-duration',
    decimalPlaces:  'data-countup-decimal-places',
    prefix:         'data-countup-prefix',
}


CountUp.Defaults = {
    duration:       2,
    decimalPlaces:  0,
    prefix:         '',
}



