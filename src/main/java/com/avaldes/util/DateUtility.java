package com.avaldes.util;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DateUtility {
  public static final String DATETIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";        

  private DateUtility() {
  }       

  public static Date getDate(String dateStr) {
    final DateFormat formatter = new SimpleDateFormat(DATETIME_FORMAT);
    try {
        return formatter.parse(dateStr);
    } catch (ParseException e) {                
        return null;
    }
  }
  
  public static Date getDate(String dateStr, String format) {
      final DateFormat formatter = new SimpleDateFormat(format);
      try {
          return formatter.parse(dateStr);
      } catch (ParseException e) {                
          return null;
      }
  }
}
