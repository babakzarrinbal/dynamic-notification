<template>
  <div class="bg-light p-2 d-flex flex-column">
    <h3 class="text-center w-100">Desctiption on how DNS (Dynamic notification system) works</h3>
    <textarea disabled="disabled" :value="value" class="flex-grow-1 w-100" style="resize:none;"></textarea>

  </div>
</template>
<script>
export default {
  data(){
    return{
      value:`
      Basicly this app/component is responsible for generating notifications
      based on templates and variables


      for generating the template for there is two way available 
      1: using %%<VARIABLE_NAME>; 
          this method is self explanatory just use the variable name whereever 
          in the template (or even in the expression clause)

      2: using {{<EXPRESSION>}}
        this is where the magic happens 
        you can use logical (javascript) expression to create value inside template with 
        following operators:
          <CONDITION>?<TRUE_VALUE>:<FALSE_VALUE>  => condition to apply value
          &&  => AND
          || =>; OR
          + => pluse (for Number values) or concate (for string values)
          - => minus (for Number values)
          / => devide (for Number values)
          % => mod (for Number values)
        and following functions:
          round(<AMOUNT>) => rounding number to near integer
          rounddown(<AMOUNT>) => round number to previous integer
          roundup(<AMOUNT>) => round number to next integer
          number(<AMOUNT>)  => converts string value to number value (for using with operators)
          gettemp(<TEMPLATE_NAME>,<TEMPLATE_LANGUAGE>,<VALUES>)
            template name and language are string values of saved templates 
            values is an json object containing variables to use refering templates 
            if no values is provided current values will be used in target template

        Examples:
          Values for this templates are for example like following:
          {
            "string": "",
            "string1": "string1",
            "string2": "string2",
            ...
            "number" : 0,
            "number1" : 1,
            "number2" : 2,
            ...
          }
          
        we can create some expression like this:
        {{string1 ? string2: string1}} // will result in "string1" value
        {{number2 - number1 - 1 && string2}} // will result in "0" value
        {{round(1.448*100)/100}}   // will result in "1.45" value 

        {{string? gettemp("temp1","en") : gettemp("temp2","fa",{"a":1,"b":"str"})}}
          will result in loading template with name temp2 and language fa with the values provided 

      
      for further information and complex situation you can contact me at

      babak.za@mtnirancell.ir
      babak.zarrinbal@dzetco.com
      babak.zarrinbal@gmail.com
      
      `
    }
  }
}
</script>
