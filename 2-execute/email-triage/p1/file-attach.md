# File Attach Error

```json
{"status":500,"requestId":"01m0z5rbehe4fk39beb2h5fxcy","message":"The file does not exist: {mail_eml_rule-d273e522-c3ba-4f13-9499-cd16dd542ecb}","countryCode":"US","currencyCode":"USD","data":{"id":"a20912f09f4f46aba722208c009d6676","date":"2026-08-26T06:57:03.590-0700","requestId":"01m0z5rbehe4fk39beb2h5fxcy","serverName":"us-uat-mycis.synnex.org","requestURL":"/file-service/public/api/file/downloading","errorCode":"E001","errorMessage":"The file does not exist: {mail_eml_rule-d273e522-c3ba-4f13-9499-cd16dd542ecb}","errorType":"BIZERROR","classType":"BizException","rootCauseStackTrace":"The file does not exist: {mail_eml_rule-d273e522-c3ba-4f13-9499-cd16dd542ecb}. com.synnex.base.service.exception.BizException: The file does not exist: {mail_eml_rule-d273e522-c3ba-4f13-9499-cd16dd542ecb}\n\tat com.synnex.file.service.fileInfo.FileInfoServiceImpl.getFileInfo(FileInfoServiceImpl.java:111)\n\tat java.base/jdk.internal.reflect.DirectMethodHandleAccessor.invoke(DirectMethodHandleAccessor.java:103)\n\tat java.base/java.lang.reflect.Method.invoke(Method.java:580)\n\tat org.springframework.aop.support.AopUtils.invokeJoinpointUsingReflection(AopUtils.java:355)\n\tat org.springframework.aop.framework.ReflectiveMethodInvocation.invokeJoinpoint(ReflectiveMethodInvocation.java:196)\n\tat org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:163)\n\tat org.springframework.aop.framework.CglibAopProxy$CglibMethodInvocation.proceed(CglibAopProxy.java:768)\n\tat org.springframework.aop.aspectj.MethodInvocationProceedingJoinPoint.proceed(MethodInvocationProceedingJoinPoint.java:8..."}}
```

---
## Error

**Files that are being attached are returning the above error in the browser when clicked on.** 

It routes to the following URL:
```
https://us-uat-mycis.synnex.org/file-service/public/api/file/downloading?appName=request-central&fileId=mail_eml_rule-38f5c6a7-2e73-4bb8-88c8-57a8b747503c
```

Triage agent needs to make sure that the file is attached to the request in the right way. Make sure the file attachments 